package com.example.todoapp.global.interceptor;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.ECPoint;
import java.security.spec.ECPublicKeySpec;
import java.security.spec.ECParameterSpec;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.todoapp.global.config.SupabaseProperties;
import com.example.todoapp.global.exception.UnauthorizedException;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AuthInterceptor implements HandlerInterceptor {

    private final SupabaseProperties supabaseProperties;
    private final RestTemplate restTemplate;

    private final Map<String, PublicKey> jwksCache = new ConcurrentHashMap<>();

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authorization header is missing or invalid");
        }

        String token = authHeader.substring(7);
        Claims claims = validateToken(token);
        request.setAttribute("userId", claims.getSubject());
        request.setAttribute("email", claims.get("email", String.class));
        return true;
    }

    private Claims validateToken(String token) {
        try {
            String alg = getAlgFromHeader(token);
            Claims claims = "ES256".equalsIgnoreCase(alg) ? verifyWithJwks(token) : verifyWithSecret(token);
            if (claims.getSubject() == null || claims.getSubject().isBlank()) {
                throw new UnauthorizedException("Invalid token: missing sub claim");
            }
            return claims;
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }

    private String getAlgFromHeader(String token) {
        try {
            String headerJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[0]));
            // 간단 파싱: "alg":"ES256"
            int idx = headerJson.indexOf("\"alg\"");
            if (idx == -1) return "HS256";
            String sub = headerJson.substring(idx + 6).trim();
            int s = sub.indexOf('"') + 1;
            int e = sub.indexOf('"', s);
            return sub.substring(s, e);
        } catch (Exception ex) {
            return "HS256";
        }
    }

    private Claims verifyWithSecret(String token) {
        byte[] keyBytes = Base64.getDecoder().decode(supabaseProperties.jwtSecret());
        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(keyBytes))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Claims verifyWithJwks(String token) {
        String kid = getKidFromHeader(token);
        PublicKey publicKey = jwksCache.computeIfAbsent(kid, this::fetchPublicKey);
        return Jwts.parser()
                .verifyWith(publicKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private String getKidFromHeader(String token) {
        try {
            String headerJson = new String(Base64.getUrlDecoder().decode(token.split("\\.")[0]));
            int idx = headerJson.indexOf("\"kid\"");
            if (idx == -1) throw new UnauthorizedException("JWT kid not found");
            String sub = headerJson.substring(idx + 6).trim();
            int s = sub.indexOf('"') + 1;
            int e = sub.indexOf('"', s);
            return sub.substring(s, e);
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception ex) {
            throw new UnauthorizedException("Failed to parse JWT kid");
        }
    }

    @SuppressWarnings("unchecked")
    private PublicKey fetchPublicKey(String kid) {
        try {
            String jwksUrl = supabaseProperties.url() + "/auth/v1/.well-known/jwks.json";
            Map<String, Object> jwks = restTemplate.exchange(
                    jwksUrl, HttpMethod.GET, null,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            ).getBody();

            List<Map<String, Object>> keys = (List<Map<String, Object>>) jwks.get("keys");
            Map<String, Object> jwk = keys.stream()
                    .filter(k -> kid.equals(k.get("kid")))
                    .findFirst()
                    .orElseThrow(() -> new UnauthorizedException("JWK not found for kid: " + kid));

            return buildEcPublicKey(jwk);
        } catch (UnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new UnauthorizedException("Failed to fetch JWKS: " + e.getMessage());
        }
    }

    private PublicKey buildEcPublicKey(Map<String, Object> jwk) throws Exception {
        Base64.Decoder decoder = Base64.getUrlDecoder();
        BigInteger x = new BigInteger(1, decoder.decode((String) jwk.get("x")));
        BigInteger y = new BigInteger(1, decoder.decode((String) jwk.get("y")));

        java.security.AlgorithmParameters params = java.security.AlgorithmParameters.getInstance("EC");
        params.init(new java.security.spec.ECGenParameterSpec("secp256r1"));
        ECParameterSpec ecSpec = params.getParameterSpec(ECParameterSpec.class);
        ECPoint point = new ECPoint(x, y);
        ECPublicKeySpec keySpec = new ECPublicKeySpec(point, ecSpec);

        return KeyFactory.getInstance("EC").generatePublic(keySpec);
    }
}

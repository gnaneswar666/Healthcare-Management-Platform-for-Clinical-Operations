package com.infosys.ApiGateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.jwt.Jwt;
@Component
public class HeaderForwardFilter implements GlobalFilter, Ordered {

	@Override
	public Mono<Void> filter(ServerWebExchange exchange,
	                         GatewayFilterChain chain) {

	    return ReactiveSecurityContextHolder.getContext()

	            .map(context -> context.getAuthentication())

	            .flatMap(authentication -> {
	            	Jwt jwt = (Jwt) authentication.getPrincipal();
	                String username = authentication.getName();

	                String role = authentication.getAuthorities()
	                        .stream()
	                        .map(a -> a.getAuthority())
	                        .filter(a ->
	                                a.equals("ROLE_ADMIN") ||
	                                a.equals("ROLE_DOCTOR") ||
	                                a.equals("ROLE_PATIENT"))
	                        .map(a -> a.replace("ROLE_", ""))
	                        .findFirst()
	                        .orElse("USER");
	                String patientId = jwt.getClaimAsString("patientId");

	                ServerHttpRequest request = exchange.getRequest()
	                        .mutate()
	                        .header("X-User", username)
	                        .header("X-Role", role)
	                        .header("X-PatientId", patientId == null ? "" : patientId)
	                        .build();

	                return chain.filter(
	                        exchange.mutate()
	                                .request(request)
	                                .build()
	                );

	            })

	            .switchIfEmpty(chain.filter(exchange));
	}
    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}
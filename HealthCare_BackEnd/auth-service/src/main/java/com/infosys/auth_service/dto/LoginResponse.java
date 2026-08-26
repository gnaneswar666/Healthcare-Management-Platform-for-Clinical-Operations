package com.infosys.auth_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class LoginResponse {

    private String token;

	public LoginResponse(String token2) {
		// TODO Auto-generated constructor stub
		   this.token = token2;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

}

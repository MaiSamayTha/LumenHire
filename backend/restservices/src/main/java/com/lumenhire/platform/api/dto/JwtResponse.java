package com.lumenhire.platform.api.dto;

import java.util.Date;

public class JwtResponse {

    private String jwtToken;
    private Date expiryDate;
    private String role;

    public JwtResponse() {
    }

    public JwtResponse(String jwtToken, Date expiryDate, String role) {
        this.jwtToken = jwtToken;
        this.expiryDate = expiryDate;
        this.role = role;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public Date getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
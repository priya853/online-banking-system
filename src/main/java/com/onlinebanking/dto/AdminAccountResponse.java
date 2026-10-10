package com.onlinebanking.dto;

import java.math.BigDecimal;

public class AdminAccountResponse {

    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private Long userId;
    private String customerName;
    private String customerEmail;

    public AdminAccountResponse() {
    }

    public AdminAccountResponse(
            Long id,
            String accountNumber,
            BigDecimal balance,
            Long userId,
            String customerName,
            String customerEmail) {

        this.id = id;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.userId = userId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}
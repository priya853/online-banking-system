package com.onlinebanking.controller;

import com.onlinebanking.dto.AccountResponse;
import com.onlinebanking.entity.BankAccount;
import com.onlinebanking.service.BankAccountService;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/admin/accounts")
public class AdminBankAccountController {

    private final BankAccountService bankAccountService;

    public AdminBankAccountController(
            BankAccountService bankAccountService) {

        this.bankAccountService = bankAccountService;
    }

    // =========================================================
    // ADMIN: CREATE BANK ACCOUNT FOR SELECTED CUSTOMER
    // POST /api/admin/accounts/user/{userId}
    // =========================================================
    @PostMapping("/user/{userId}")
    public AccountResponse createAccountForUser(
            @PathVariable Long userId) {

        BankAccount account =
                bankAccountService.createAccountForUser(userId);

        return convertToResponse(account);
    }



    // =========================================================
    // CONVERT BANK ACCOUNT ENTITY TO RESPONSE
    // =========================================================
    private AccountResponse convertToResponse(
            BankAccount account) {

        return new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getUser().getId(),
                account.getUser().getName(),
                account.getUser().getEmail()
        );
    }
}
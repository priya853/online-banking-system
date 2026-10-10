package com.onlinebanking.controller;

import com.onlinebanking.entity.BankAccount;
import com.onlinebanking.entity.Transaction;
import com.onlinebanking.entity.User;
import com.onlinebanking.repository.BankAccountRepository;
import com.onlinebanking.repository.TransactionRepository;
import com.onlinebanking.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
public class BankDashboardController {

    private final UserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;

    public BankDashboardController(
            UserRepository userRepository,
            BankAccountRepository bankAccountRepository,
            TransactionRepository transactionRepository) {

        this.userRepository = userRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.transactionRepository = transactionRepository;
    }

    // =========================================================
    // BANK DASHBOARD SUMMARY
    // =========================================================

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {

        List<User> users = userRepository.findAll();
        List<BankAccount> accounts = bankAccountRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        long totalCustomers = users.stream()
                .filter(this::isCustomer)
                .count();

        BigDecimal totalBalance = accounts.stream()
                .map(BankAccount::getBalance)
                .filter(balance -> balance != null)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "totalCustomers",
                totalCustomers
        );

        response.put(
                "totalAccounts",
                accounts.size()
        );

        response.put(
                "totalTransactions",
                transactions.size()
        );

        response.put(
                "totalBalance",
                totalBalance
        );

        return response;
    }

    // =========================================================
    // BANK CUSTOMERS
    // =========================================================

    @GetMapping("/customers")
    public List<Map<String, Object>> getCustomers() {

        return userRepository.findAll()
                .stream()
                .filter(this::isCustomer)
                .map(this::convertCustomer)
                .toList();
    }

    // =========================================================
    // BANK ACCOUNTS
    // =========================================================

    @GetMapping("/accounts")
    public List<Map<String, Object>> getAccounts() {

        return bankAccountRepository.findAll()
                .stream()
                .map(this::convertAccount)
                .toList();
    }

    // =========================================================
    // BANK TRANSACTIONS
    // =========================================================

    @GetMapping("/transactions")
    public List<Map<String, Object>> getTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::convertTransaction)
                .toList();
    }

    // =========================================================
    // CHECK CUSTOMER ROLE
    // =========================================================

    private boolean isCustomer(User user) {

        String role = user.getRole();

        if (role == null || role.isBlank()) {
            return true;
        }

        return !role.equalsIgnoreCase("ROLE_ADMIN")
                && !role.equalsIgnoreCase("ROLE_BANK");
    }

    // =========================================================
    // CUSTOMER RESPONSE
    // =========================================================

    private Map<String, Object> convertCustomer(
            User user) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", user.getPhone());
        response.put("status", user.getStatus());
        response.put("role", user.getRole());

        return response;
    }

    // =========================================================
    // ACCOUNT RESPONSE
    // =========================================================

    private Map<String, Object> convertAccount(
            BankAccount account) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("id", account.getId());
        response.put(
                "accountNumber",
                account.getAccountNumber()
        );
        response.put(
                "balance",
                account.getBalance()
        );

        if (account.getUser() != null) {

            response.put(
                    "userId",
                    account.getUser().getId()
            );

            response.put(
                    "customerName",
                    account.getUser().getName()
            );

            response.put(
                    "customerEmail",
                    account.getUser().getEmail()
            );
        }

        return response;
    }

    // =========================================================
    // TRANSACTION RESPONSE
    // =========================================================

    private Map<String, Object> convertTransaction(
            Transaction transaction) {

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "id",
                transaction.getId()
        );

        response.put(
                "accountNumber",
                transaction.getAccountNumber()
        );

        response.put(
                "type",
                transaction.getType()
        );

        response.put(
                "amount",
                transaction.getAmount()
        );

        response.put(
                "balanceAfterTransaction",
                transaction.getBalanceAfterTransaction()
        );

        response.put(
                "transactionDate",
                transaction.getTransactionDate()
        );

        return response;
    }
}
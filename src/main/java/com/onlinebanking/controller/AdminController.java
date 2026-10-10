package com.onlinebanking.controller;

import com.onlinebanking.dto.AdminAccountResponse;
import com.onlinebanking.dto.AdminTransactionResponse;
import com.onlinebanking.dto.AdminUserResponse;
import com.onlinebanking.entity.BankAccount;
import com.onlinebanking.entity.Transaction;
import com.onlinebanking.entity.User;
import com.onlinebanking.repository.BankAccountRepository;
import com.onlinebanking.repository.TransactionRepository;
import com.onlinebanking.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final BankAccountRepository bankAccountRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserRepository userRepository,
            BankAccountRepository bankAccountRepository,
            TransactionRepository transactionRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.bankAccountRepository = bankAccountRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertUserToResponse)
                .toList();
    }

    // =========================================================
    // CREATE BANK MANAGER
    // =========================================================

    @PostMapping("/bank-users")
    public ResponseEntity<?> createBankManager(
            @RequestBody Map<String, Object> request) {

        String name = getValue(request, "name");
        String email = getValue(request, "email");
        String password = getValue(request, "password");
        String phone = getValue(request, "phone");
        String bankName = getValue(request, "bankName");
        String branch = getValue(request, "branch");

        // Required field validation
        if (name.isBlank()
                || email.isBlank()
                || password.isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Name, email and password are required.");
        }

        // Check duplicate email
        if (userRepository.findByEmail(email).isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Email is already registered.");
        }

        // Create new bank manager
        User bankManager = new User();

        bankManager.setName(name);
        bankManager.setEmail(email);
        bankManager.setPassword(
                passwordEncoder.encode(password)
        );

        bankManager.setPhone(phone);
        bankManager.setBankName(bankName);
        bankManager.setBranch(branch);

        // IMPORTANT:
        // Register Manager creates BANK user, not ADMIN.
        bankManager.setRole("ROLE_BANK");
        bankManager.setStatus("ACTIVE");

        User savedUser = userRepository.save(bankManager);

        // Safe response - never return password
        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put("id", savedUser.getId());
        response.put("name", savedUser.getName());
        response.put("email", savedUser.getEmail());
        response.put("phone", savedUser.getPhone());
        response.put("bankName", savedUser.getBankName());
        response.put("branch", savedUser.getBranch());
        response.put("role", savedUser.getRole());
        response.put("status", savedUser.getStatus());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================================================
    // BLOCK USER
    // =========================================================

    @PutMapping("/users/{id}/block")
    public String blockUser(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setStatus("BLOCKED");

        userRepository.save(user);

        return "User blocked successfully";
    }

    // =========================================================
    // ACTIVATE USER
    // =========================================================

    @PutMapping("/users/{id}/activate")
    public String activateUser(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setStatus("ACTIVE");

        userRepository.save(user);

        return "User activated successfully";
    }

    // =========================================================
    // GET ALL ACCOUNTS
    // =========================================================

    @GetMapping("/accounts")
    public List<AdminAccountResponse> getAllAccounts() {

        return bankAccountRepository.findAll()
                .stream()
                .map(this::convertAccountToResponse)
                .toList();
    }

    // =========================================================
    // GET ALL TRANSACTIONS
    // =========================================================

    @GetMapping("/transactions")
    public List<AdminTransactionResponse> getAllTransactions() {

        return transactionRepository.findAll()
                .stream()
                .map(this::convertTransactionToResponse)
                .toList();
    }

    // =========================================================
    // =========================================================
    // DELETE CUSTOMER
    // =========================================================

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteCustomer(
            @PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        String role = String.valueOf(user.getRole())
                .trim()
                .toUpperCase();

        // Protect Admin and Bank users
        if ("ROLE_ADMIN".equals(role)
                || "ROLE_BANK".equals(role)) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Admin and Bank users cannot be deleted from this page.");
        }

        // Find all bank accounts of this customer
        List<BankAccount> accounts =
                bankAccountRepository.findAll()
                        .stream()
                        .filter(account ->
                                account.getUser() != null
                                        && account.getUser().getId()
                                        .equals(id))
                        .toList();

        // Collect account numbers
        List<String> accountNumbers =
                accounts.stream()
                        .map(BankAccount::getAccountNumber)
                        .filter(accountNumber ->
                                accountNumber != null
                                        && !accountNumber.isBlank())
                        .toList();

        // Delete related transactions first
        if (!accountNumbers.isEmpty()) {

            List<Transaction> transactions =
                    transactionRepository.findAll()
                            .stream()
                            .filter(transaction ->
                                    transaction.getAccountNumber() != null
                                            && accountNumbers.contains(
                                            transaction.getAccountNumber()
                                    ))
                            .toList();

            if (!transactions.isEmpty()) {
                transactionRepository.deleteAll(transactions);
            }
        }

        // Delete bank accounts
        if (!accounts.isEmpty()) {
            bankAccountRepository.deleteAll(accounts);
        }

        // Finally delete customer
        userRepository.delete(user);

        return ResponseEntity.noContent().build();
    }
    // HELPER - READ REQUEST VALUE
    // =========================================================

    private String getValue(
            Map<String, Object> request,
            String key) {

        Object value = request.get(key);

        if (value == null) {
            return "";
        }

        return value.toString().trim();
    }

    // =========================================================
    // CONVERT USER TO RESPONSE
    // =========================================================

    private AdminUserResponse convertUserToResponse(
            User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getBankName(),
                user.getBranch(),
                user.getRole(),
                user.getStatus()
        );
    }

    // =========================================================
    // CONVERT ACCOUNT TO RESPONSE
    // =========================================================

    private AdminAccountResponse convertAccountToResponse(
            BankAccount account) {

        return new AdminAccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getBalance(),
                account.getUser().getId(),
                account.getUser().getName(),
                account.getUser().getEmail()
        );
    }

    // =========================================================
    // CONVERT TRANSACTION TO RESPONSE
    // =========================================================

    private AdminTransactionResponse convertTransactionToResponse(
            Transaction transaction) {

        return new AdminTransactionResponse(
                transaction.getId(),
                transaction.getAccountNumber(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getBalanceAfterTransaction(),
                transaction.getTransactionDate()
        );
    }
}
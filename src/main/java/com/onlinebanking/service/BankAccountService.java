package com.onlinebanking.service;

import com.onlinebanking.entity.BankAccount;
import com.onlinebanking.entity.Transaction;
import com.onlinebanking.entity.User;
import com.onlinebanking.repository.BankAccountRepository;
import com.onlinebanking.repository.TransactionRepository;
import com.onlinebanking.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class BankAccountService {

    private final BankAccountRepository bankAccountRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public BankAccountService(
            BankAccountRepository bankAccountRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.bankAccountRepository = bankAccountRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    // Create new bank account for logged-in user
    public BankAccount createAccount(String loggedInEmail) {

        User user = userRepository
                .findByEmail(loggedInEmail)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        BankAccount account = new BankAccount();

        account.setAccountNumber(
                generateAccountNumber()
        );

        account.setBalance(BigDecimal.ZERO);
        account.setUser(user);

        return bankAccountRepository.save(account);
    }

    // Create new bank account for a specific customer
    // Used by Admin
    public BankAccount createAccountForUser(Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        BankAccount account = new BankAccount();

        account.setAccountNumber(
                generateAccountNumber()
        );

        account.setBalance(BigDecimal.ZERO);
        account.setUser(user);

        return bankAccountRepository.save(account);
    }

    // Get account by account number
    public BankAccount getAccountByNumber(
            String accountNumber,
            String loggedInEmail) {

        BankAccount account =
                bankAccountRepository
                        .findByAccountNumber(accountNumber)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bank account not found"
                                ));

        User loggedInUser =
                userRepository
                        .findByEmail(loggedInEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        // Ownership check
        if (!account.getUser().getId()
                .equals(loggedInUser.getId())) {

            throw new AccessDeniedException(
                    "You are not authorized to access this account"
            );
        }

        return account;
    }

    // Get all accounts of logged-in user
    public List<BankAccount> getAllAccounts(
            String loggedInEmail) {

        User loggedInUser =
                userRepository
                        .findByEmail(loggedInEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return bankAccountRepository
                .findByUser(loggedInUser);
    }

    // Get all bank accounts for Admin
    public List<BankAccount> getAllAccountsForAdmin() {

        return bankAccountRepository.findAll();
    }

    // Deposit money
    public BankAccount deposit(
            String accountNumber,
            BigDecimal amount,
            String loggedInEmail) {

        validateAmount(
                amount,
                "Deposit amount must be greater than zero"
        );

        BankAccount account =
                getAccountByNumber(
                        accountNumber,
                        loggedInEmail
                );

        BigDecimal newBalance =
                account.getBalance()
                        .add(amount);

        account.setBalance(newBalance);

        BankAccount savedAccount =
                bankAccountRepository.save(account);

        saveTransaction(
                accountNumber,
                "DEPOSIT",
                amount,
                newBalance
        );

        return savedAccount;
    }

    // Withdraw money
    public BankAccount withdraw(
            String accountNumber,
            BigDecimal amount,
            String loggedInEmail) {

        validateAmount(
                amount,
                "Withdrawal amount must be greater than zero"
        );

        BankAccount account =
                getAccountByNumber(
                        accountNumber,
                        loggedInEmail
                );

        // Check sufficient balance
        if (account.getBalance()
                .compareTo(amount) < 0) {

            throw new RuntimeException(
                    "Insufficient balance"
            );
        }

        BigDecimal newBalance =
                account.getBalance()
                        .subtract(amount);

        account.setBalance(newBalance);

        BankAccount savedAccount =
                bankAccountRepository.save(account);

        saveTransaction(
                accountNumber,
                "WITHDRAW",
                amount,
                newBalance
        );

        return savedAccount;
    }

    // Validate transaction amount
    private void validateAmount(
            BigDecimal amount,
            String errorMessage) {

        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(errorMessage);
        }
    }

    // Save transaction record
    private void saveTransaction(
            String accountNumber,
            String type,
            BigDecimal amount,
            BigDecimal balanceAfterTransaction) {

        Transaction transaction =
                new Transaction();

        transaction.setAccountNumber(
                accountNumber
        );

        transaction.setType(type);

        transaction.setAmount(amount);

        transaction.setBalanceAfterTransaction(
                balanceAfterTransaction
        );

        transaction.setTransactionDate(
                LocalDateTime.now()
        );

        transactionRepository.save(transaction);
    }

    // Generate unique 12-digit account number
    private String generateAccountNumber() {

        String accountNumber;

        do {
            long number =
                    ThreadLocalRandom.current()
                            .nextLong(
                                    100000000000L,
                                    1000000000000L
                            );

            accountNumber =
                    String.valueOf(number);

        } while (
                bankAccountRepository
                        .findByAccountNumber(accountNumber)
                        .isPresent()
        );

        return accountNumber;
    }
}
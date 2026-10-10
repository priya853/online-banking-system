package com.onlinebanking.repository;

import com.onlinebanking.entity.BankAccount;
import com.onlinebanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository
        extends JpaRepository<BankAccount, Long> {

    Optional<BankAccount> findByAccountNumber(
            String accountNumber
    );

    boolean existsByAccountNumber(
            String accountNumber
    );

    List<BankAccount> findByUser(
            User user
    );
}
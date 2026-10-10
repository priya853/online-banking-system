package com.onlinebanking.repository;

import com.onlinebanking.entity.BankBranch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankBranchRepository extends JpaRepository<BankBranch, Long> {
}

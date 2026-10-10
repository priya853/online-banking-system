package com.onlinebanking.controller;

import com.onlinebanking.entity.BankBranch;
import com.onlinebanking.repository.BankBranchRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banks")
public class BankBranchController {

    private final BankBranchRepository bankBranchRepository;

    public BankBranchController(BankBranchRepository bankBranchRepository) {
        this.bankBranchRepository = bankBranchRepository;
    }

    @GetMapping
    public List<BankBranch> getAllBanks() {
        return bankBranchRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<BankBranch> addBank(@RequestBody BankBranch bankBranch) {
        bankBranch.setId(null);

        if (bankBranch.getStatus() == null
                || bankBranch.getStatus().isBlank()) {
            bankBranch.setStatus("Active");
        }

        BankBranch savedBank = bankBranchRepository.save(bankBranch);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBank);
    }
}

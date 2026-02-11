package com.project001.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project001.backend.entity.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}

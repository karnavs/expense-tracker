package com.project001.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project001.backend.entity.Expense;
import com.project001.backend.exception.ResourceNotFoundException;
import com.project001.backend.repository.ExpenseRepository;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }
    public void deleteExpense(Long id) {
    expenseRepository.deleteById(id);
}
public Expense updateExpense(Long id, Expense updatedExpense) {
    Expense expense = expenseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

    expense.setTitle(updatedExpense.getTitle());
    expense.setAmount(updatedExpense.getAmount());
    expense.setCategory(updatedExpense.getCategory());

    return expenseRepository.save(expense);
}
public Expense getExpenseById(Long id) {
    return expenseRepository.findById(id)
    .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));

}

}

package com.project001.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project001.backend.entity.Expense;
import com.project001.backend.service.ExpenseService;

@RestController
@RequestMapping("/expenses")
@CrossOrigin
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    @GetMapping
    public List<Expense> getExpenses() {
        return expenseService.getAllExpenses();
    }
    @DeleteMapping("/{id}")
public void deleteExpense(@PathVariable Long id) {
    expenseService.deleteExpense(id);
}
    @PutMapping("/{id}")
public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
    return expenseService.updateExpense(id, expense);
}
@GetMapping("/{id}")
public Expense getExpenseById(@PathVariable Long id) {
    return expenseService.getExpenseById(id);
}



}

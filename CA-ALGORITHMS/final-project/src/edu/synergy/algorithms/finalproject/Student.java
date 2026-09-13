package edu.synergy.algorithms.finalproject;
public record Student(String firstName,String lastName,String middleName,String faculty,int grade){public String fullName(){return String.join(" ",lastName,firstName,middleName).trim();}}

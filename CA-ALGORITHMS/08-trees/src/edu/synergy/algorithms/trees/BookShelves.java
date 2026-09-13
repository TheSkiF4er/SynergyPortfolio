package edu.synergy.algorithms.trees;
import java.util.*;
public final class BookShelves { private BookShelves(){} public static Map<String,Integer> getBookAndNumber(Map<Integer,String> source){Map<String,Integer>out=new LinkedHashMap<>();source.entrySet().stream().sorted(Map.Entry.comparingByKey()).forEach(e->out.put(e.getValue(),e.getKey()));return out;} public static Map<Integer,String> sortedByShelf(Map<Integer,String> source){return new TreeMap<>(source);} }

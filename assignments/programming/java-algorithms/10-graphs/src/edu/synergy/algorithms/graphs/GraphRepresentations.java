package edu.synergy.algorithms.graphs;
import java.util.*;
public final class GraphRepresentations {
 private GraphRepresentations(){}
 // Task 1: directed graph 1→2, 1→4, 2→3, 2→4, 4→3 (stored as 0..3).
 public static int[][] task1Matrix(){return new int[][]{{0,1,0,1},{0,0,1,1},{0,0,0,0},{0,0,1,0}};}
 // Task 3: graph from the worksheet, stored as an adjacency list.
 public static Map<Integer,List<Integer>> task3AdjacencyList(){Map<Integer,List<Integer>>m=new LinkedHashMap<>();m.put(3,List.of(2,5));m.put(2,List.of(6));m.put(5,List.of(4,1));m.put(6,List.of());m.put(4,List.of());m.put(1,List.of());return m;}
 // Task 2 matrix from the worksheet (P1..P8).
 public static int[][] task2Matrix(){return new int[][]{{0,1,1,0,1,0,0,0},{1,0,0,1,1,0,0,1},{1,0,0,0,0,0,1,1},{0,1,0,0,0,0,0,0},{1,1,0,0,0,1,0,0},{1,0,0,0,1,0,1,0},{0,0,1,0,0,1,0,0},{0,1,1,0,0,0,0,0}};}
 public static Map<Integer,List<Integer>> task4AdjacencyList(){Map<Integer,List<Integer>>m=new LinkedHashMap<>();m.put(0,List.of(1,2));m.put(1,List.of(2,3));m.put(2,List.of(1));m.put(3,List.of(2));return m;}
}

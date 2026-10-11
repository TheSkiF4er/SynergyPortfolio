package edu.synergy.algorithms.linear;
import java.util.*;
public final class LinearAlgorithms {
 private LinearAlgorithms() {}
 public static double findMinValue(double[] a){require(a);double m=a[0];for(double v:a)if(v<m)m=v;return m;} // O(n)
 public static double findMaxValue(double[] a){require(a);double m=a[0];for(double v:a)if(v>m)m=v;return m;} // O(n)
 public static double findAverageValue(double[] a){require(a);double s=0;for(double v:a)s+=v;return s/a.length;} // O(n)
 public static double average(double[] a){return findAverageValue(a);}
 public static String findStudentMaxGrade(Map<String,int[]> grades){if(grades.isEmpty())throw new IllegalArgumentException("empty");String best=null;double bestAvg=-Double.MAX_VALUE;for(var e:grades.entrySet()){int[] g=e.getValue();if(g.length==0)continue;double s=0;for(int v:g)s+=v;double avg=s/g.length;if(avg>bestAvg){bestAvg=avg;best=e.getKey();}}return best;} // O(total grades)
 public static int[] removeElement(int[] array,int target){int count=0;for(int v:array)if(v!=target)count++;int[] out=new int[count];int i=0;for(int v:array)if(v!=target)out[i++]=v;return out;} // O(n)
 public static String bestStudent(Map<String,int[]> grades){return findStudentMaxGrade(grades);}
 public static int[] removeAll(int[] array,int target){return removeElement(array,target);}
 private static void require(double[] a){if(a==null||a.length==0)throw new IllegalArgumentException("array is empty");}
}

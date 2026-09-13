package edu.synergy.algorithms.arrays;
public final class ArrayAlgorithms {
 private ArrayAlgorithms(){}
 // Task 1. General sorted-array solution is O(n); the O(log n) limit stated in the worksheet is not generally achievable.
 public static int[] binarySearch(int[] array,int target){int i=0,j=1;while(i<array.length&&j<array.length){if(i==j){j++;continue;}long d=(long)array[j]-array[i];if(d==target)return new int[]{i,j};if(d<target)j++;else i++;}return new int[]{-1,-1};}
 public static int[] pairWithDifference(int[] array,int target){return binarySearch(array,target);}
 // Task 2. Signature follows the worksheet even though an index is naturally an int.
 public static double binarySearch(String[] array,String target){int l=0,r=array.length-1;while(l<=r){int m=(l+r)>>>1;int c=array[m].compareTo(target);if(c==0)return m;if(c<0)l=m+1;else r=m-1;}return -1;}
 // Task 3: previous lexicographical permutation in O(n), returned as a new digit array.
 public static int[] getClosestLowerNumberDec(int[] num){if(num==null||num.length<2)return num==null?null:num.clone();int[]a=num.clone();int i=a.length-2;while(i>=0&&a[i]<=a[i+1])i--;if(i<0)return a;int j=a.length-1;while(j>i&&a[j]>=a[i])j--;if(i==0&&a[j]==0){int k=j-1;while(k>i&&a[k]>=a[i]||k>i&&a[k]==0)k--;if(k<=i||a[k]==0)return a;j=k;}int t=a[i];a[i]=a[j];a[j]=t;for(int l=i+1,h=a.length-1;l<h;l++,h--){t=a[l];a[l]=a[h];a[h]=t;}return a;}
}

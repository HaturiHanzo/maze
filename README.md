# Maze
Repository contains an algorithm which is finding closed path in maze
and sandbox which is written using HTML5 canvas.

## Demo
[HTML5 sandbox](https://haturihanzo.github.io/maze)
(please open this link in latest browser, because project was written using ES6 features)

## Task
![alt text](https://raw.githubusercontent.com/haturihanzo/maze/master/example.jpg)
#### Input data:
Input data is a file which contains several mazes descriptions. Every description starts by
line with 2 numbers (`1 <= w, h <= 75`) which are setting maze height and width. Next `h` lines sets a maze
each of them must contain `w` characters. There are 2 available symbols: `/` and `\`. 
Input data ends with an empty line.

#### Output data:
Output data contains information about every closed path length in a maze and the summary.

Example: 
```
Input:
6 4
\//\\/
\///\/
//\\/\
\/\///
3 3
///
\//
\\\


Output:
Maze #1:
2 Cycles; the longest has length 16.

Maze #2:
There are no cycles.
```
# Advent of Code 2021

My progress on the [Advent of Code 2021](https://adventofcode.com/2021) puzzles.

I'm not following the schedule exactly since I have other things going on in my life, but I'm using it as an opportunity to get familiar with [Deno](https://deno.land/).


## Usage

To run the solutions, pipe the input files into the main script, and specify the day. Here's an example for running day 1:

```
cat input/1 | deno run main.ts 1
```

Most of the day scripts also have CLI flags, and that can be used to alter the execution. They aren't explicitly documented, but you can find them by looking at the day scripts source code.

I use these to change between running the first and second parts of the puzzles; for example, this updates the sliding window size in the day 1 puzzle to 3: 

```
cat input/1 | deno run main.ts 1 --windowSize=3
```

The flags are set up with long and short options. This should execute the same as above:

```
cat input/1 | deno run main.ts 1 -w 3
```

### Boilerplate

Generating new day scripts can be done using the boilerplate script, simply by including the day number into the CLI arguments. Read and write must be allowed to generate the files. 

For example, this will produce the necessary changes to include day 32:

```
deno run --allow-read --allow-write boilerplate.ts 32
```

## Forthcoming
*  Finish all the puzzles!
*  Print help messages for each day and document the available flags
*  Read input files directly rather than only from standard input
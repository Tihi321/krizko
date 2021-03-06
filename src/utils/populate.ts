import forEach from "lodash/forEach";
import map from "lodash/map";

import { ECrosswordInfo, ECrosswordType } from "../constants";
import type { TCrosswordItem, TCrosswordItems, TCrosswordTable, TWordRowInfo } from "../types";

export const generateWordRowInformation = ({ rowIndex, itemIndex, word, type }): TWordRowInfo => ({
  rowIndex,
  itemIndex,
  word,
  type,
});

export const populateHorizontalTableLetters = (
  crosswordsTable: TCrosswordTable
): TCrosswordTable => {
  let leftWords: TWordRowInfo[] = [];
  let updatedCrosswordTable = [...crosswordsTable];

  forEach(crosswordsTable, (rowData: TCrosswordItems, rowIndex: number) => {
    forEach(rowData, (item: TCrosswordItem, itemIndex: number) => {
      if (item.left !== ECrosswordInfo.EmptySpace) {
        leftWords = [
          ...leftWords,
          generateWordRowInformation({
            rowIndex,
            itemIndex,
            word: item.left,
            type: ECrosswordType.Left,
          }),
        ];
      }
    });
  });

  forEach(leftWords, ({ rowIndex, itemIndex, word }: TWordRowInfo) => {
    const letters = word.name.split("");

    forEach(letters, (letter: string, index: number) => {
      const letterItemIndex = itemIndex + index;

      updatedCrosswordTable = map(
        updatedCrosswordTable,
        (rows: TCrosswordItems, rowInnerIndex: number) =>
          map(rows, (item: TCrosswordItem, itemInnerIndex: number) => {
            if (rowIndex === rowInnerIndex && itemInnerIndex === letterItemIndex) {
              return {
                ...item,
                char: letter,
                leftEnd: itemInnerIndex === word.endIndex - 1,
              };
            }

            return item;
          })
      );
    });
  });

  return updatedCrosswordTable;
};

export const populateVerticalTableLetters = (crosswordsTable: TCrosswordTable): TCrosswordTable => {
  let topWords: TWordRowInfo[] = [];
  let updatedCrosswordTable = [...crosswordsTable];

  forEach(crosswordsTable, (rowData: TCrosswordItems, rowIndex: number) => {
    forEach(rowData, (item: TCrosswordItem, itemIndex: number) => {
      if (item.top !== ECrosswordInfo.EmptySpace) {
        topWords = [
          ...topWords,
          generateWordRowInformation({
            rowIndex,
            itemIndex,
            word: item.top,
            type: ECrosswordType.Top,
          }),
        ];
      }
    });
  });

  forEach(topWords, ({ rowIndex, itemIndex, word }: TWordRowInfo) => {
    const newRowItem = rowIndex + 1;
    const previousWordIndex = itemIndex - 1;
    if (
      updatedCrosswordTable[newRowItem][itemIndex].char !== ECrosswordInfo.EmptySpace ||
      (updatedCrosswordTable[rowIndex][previousWordIndex] &&
        updatedCrosswordTable[rowIndex][previousWordIndex].top !== ECrosswordInfo.EmptySpace)
    ) {
      updatedCrosswordTable = map(
        updatedCrosswordTable,
        (rows: TCrosswordItems, rowInnerIndex: number) =>
          map(rows, (item: TCrosswordItem, itemInnerIndex: number) => {
            if (rowIndex === rowInnerIndex && itemIndex === itemInnerIndex) {
              return {
                ...item,
                top: ECrosswordInfo.EmptySpace,
              };
            }

            return item;
          })
      );
    } else {
      const letters = word.name.split("");

      forEach(letters, (letter: string, index: number) => {
        const letterRowIndex = rowIndex + index;

        updatedCrosswordTable = map(
          updatedCrosswordTable,
          (rows: TCrosswordItems, rowInnerIndex: number) =>
            map(rows, (item: TCrosswordItem, itemInnerIndex: number) => {
              if (letterRowIndex === rowInnerIndex && itemIndex === itemInnerIndex) {
                return {
                  ...item,
                  char: letter,
                  topEnd: rowInnerIndex === word.endIndex - 1,
                };
              }

              return item;
            })
        );
      });
    }
  });

  return updatedCrosswordTable;
};

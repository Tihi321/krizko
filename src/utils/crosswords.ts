import forEach from "lodash/forEach"
import map from "lodash/map"

import { getRandomRangeItemsAndRemove } from "./array";
import { generateWordObject, getWordsDetails, getWordsInformation} from "./words";
import type { TDetails, TWordArray, TWordsInfo } from "../types";
import { addHorizontalWords, addVerticalWords, ECrosswordInfo, ECrosswordType, generateEmptyInitialTable, type TCrosswordItem, type TCrosswordItems, type TCrosswordTable } from "./table";
import { generateWordRowInformation, populateHorizontalTableLetters, populateVerticalTableLetters, type TWordRowInfo } from "./populate";

export type TCrosswordTableData = {
  details: TDetails;
  table: TCrosswordTable;
  words: TWordsInfo;
}

const getWordsData = (crosswordsTable :TCrosswordTable): TCrosswordTableData => {
  let words: TWordRowInfo[] = [];
  let updatedCrosswordTable = [...crosswordsTable];

  forEach(updatedCrosswordTable, (rowData: TCrosswordItems, rowIndex: number) => {
    forEach(rowData, (item: TCrosswordItem, itemIndex: number) => {
      if(item.top !== ECrosswordInfo.EmptySpace) {
        words = [...words, generateWordRowInformation({
          rowIndex,
          itemIndex,
          word: item.top,
          type: ECrosswordType.Top
        })]
      }
      if(item.left !== ECrosswordInfo.EmptySpace) {
        words = [...words, generateWordRowInformation({
          rowIndex,
          itemIndex,
          word: item.left,
          type: ECrosswordType.Left
        })]
      }
    }) 
  });

  forEach(words, ({ rowIndex, itemIndex, word, type }: TWordRowInfo, index: number) => {
    const wordIndex = index + 1;

    updatedCrosswordTable = map(updatedCrosswordTable, (rows: TCrosswordItems, rowInnerIndex: number) => {
      return map(rows, (item: TCrosswordItem, itemInnerIndex: number) => {
        if (rowIndex === rowInnerIndex && itemIndex === itemInnerIndex) {
          if (type === ECrosswordType.Top) {
            return {
              ...item,
              top: {
                ...item.top,
                index: wordIndex
              }, 
            }
          } else {
            return {
              ...item,
              left: {
                ...item.left,
                index: wordIndex
              }, 
            }
          }
        }

        return item;
      })
    });
  });

  return {
    details: getWordsDetails(words),
    words: getWordsInformation(words),
    table: updatedCrosswordTable
  };

}

type TGenerateCrossword = {
  words: TWordArray
};

export const generateCrosswordsTable = ({words: initialWords}: TGenerateCrossword): TCrosswordTableData => {
  const {
    randomItems: selectedWords
  } = getRandomRangeItemsAndRemove(initialWords, 800);

  const selectedWordsData = map(selectedWords, (word: string) => generateWordObject(word));

  const emptyTable = generateEmptyInitialTable();

  const {crosswordsTable: horizontalWordTable, availableWords: availableHorizontalWords } = addHorizontalWords({ availableWords: selectedWordsData, crosswordsTable: emptyTable });
  const populatedHorizontalTable = populateHorizontalTableLetters(horizontalWordTable);

  const {crosswordsTable: verticalWordTable} = addVerticalWords({ availableWords: availableHorizontalWords, crosswordsTable :populatedHorizontalTable });
  const populatedTable = populateVerticalTableLetters(verticalWordTable);

;
  return getWordsData(populatedTable)
}
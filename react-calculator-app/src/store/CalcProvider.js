import { useReducer } from 'react';
import { CalcContext } from './CalcContext';
import { calcReducer, initialState, INITIAL_VALUE } from './calcReducer';
import { MIN_DIGIT_LENGTH } from '../constants/numbers';
import {
  INFINITY_NUM_ERROR,
  MIN_DIGIT_LENGTH_ERROR,
} from '../constants/errorMessages';
import { OPERATOR_REGEX } from '../constants/regex';

export const CalcProvider = ({ children }) => {
  const [state, dispatch] = useReducer(calcReducer, initialState);

  const addDigit = (digit) => {
    if (state.currentNum.length > MIN_DIGIT_LENGTH) {
      alert(MIN_DIGIT_LENGTH_ERROR);
      return;
    }

    dispatch({ type: 'ADD_CURRENT_NUM', payload: digit });

    if (state.total === INITIAL_VALUE) {
      dispatch({ type: 'SET_VALUE', payload: digit });
      return;
    }

    dispatch({ type: 'ADD_VALUE', payload: digit });
  };
  const addOperator = (operator) => {
    dispatch({ type: 'ADD_OPERATOR', operator });
  };

  const calculate = () => {
    const [num1, num2] = state.total
      .replace(OPERATOR_REGEX, ',')
      .split(',')
      .map(Number);
    const operator = state.operator;
    let result = 0;

    switch (operator) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case 'X':
        result = num1 * num2;
        break;
      case '/':
        result = Math.trunc(num1 / num2);
        break;
      default:
        throw new Error('Invalid Operator type');
    }

    if (result === Infinity) {
      alert(INFINITY_NUM_ERROR);
      return;
    }

    dispatch({ type: 'CALCULATE', payload: String(result) });
  };
  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <CalcContext.Provider
      value={{ ...state, addDigit, addOperator, calculate, reset }}
    >
      {children}
    </CalcContext.Provider>
  );
};

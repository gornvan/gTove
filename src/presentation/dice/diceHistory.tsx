import {FunctionComponent, useCallback} from 'react';
import {useDispatch} from 'react-redux';

import './diceHistory.scss';

import InputButton from '../inputButton';
import {clearDiceHistoryAction, DiceReducerType} from '../../redux/diceReducer';
import DiceResult from './diceResult';
import {DriveUser} from '../../util/googleDriveUtils';

interface DiceResultProps {
    dice: DiceReducerType;
    sortDice: boolean;
    busy: boolean;
    myPeerId: string;
    loggedInUser: DriveUser;
    userDiceColours: {diceColour: string, textColour: string};
}

const DiceHistory: FunctionComponent<DiceResultProps> = ({dice, sortDice, busy, myPeerId, loggedInUser, userDiceColours}) => {
    const dispatch = useDispatch();
    const onClearHistory = useCallback(() => {
        dispatch(clearDiceHistoryAction());
    }, [dispatch]);
    return dice.historyIds.length === 0 ? null : (
        <div className='diceHistory'>
            <InputButton type='button' onChange={onClearHistory}>Clear Roll History</InputButton>
            {
                dice.historyIds.map((rollId) => (
                    <DiceResult key={'history-' + rollId} history={dice.history[rollId]} sortDice={sortDice} busy={busy}
                                myPeerId={myPeerId} loggedInUser={loggedInUser} userDiceColours={userDiceColours}
                    />
                ))
            }
        </div>
    )
};

export default DiceHistory;
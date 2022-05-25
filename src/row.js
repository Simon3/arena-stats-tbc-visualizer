import {
  SEASON_FOUR_START,
  SEASON_ONE_END,
  SEASON_ONE_START,
  SEASON_THREE_END,
  SEASON_THREE_START,
  SEASON_TWO_END,
  SEASON_TWO_START,
} from './constants';
import { enemy } from './util';

// noinspection JSUnusedGlobalSymbols
export class Row {
  constructor(row) {
    this.isRanked = row[0];
    this.startTime = Number(row[1]);
    this.endTime = Number(row[2]);
    this.zoneId = row[3];
    this.duration = Number(row[4]);
    this.teamName = row[5];
    this.teamColor = row[6];
    this.winnerColor = row[7];
    this.teamPlayerName1 = row[8];
    this.teamPlayerName2 = row[9];
    this.teamPlayerName3 = row[10];
    this.teamPlayerName4 = row[11];
    this.teamPlayerName5 = row[12];
    this.teamPlayerClass1 = row[13];
    this.teamPlayerClass2 = row[14];
    this.teamPlayerClass3 = row[15];
    this.teamPlayerClass4 = row[16];
    this.teamPlayerClass5 = row[17];
    this.teamPlayerRace1 = row[18];
    this.teamPlayerRace2 = row[19];
    this.teamPlayerRace3 = row[20];
    this.teamPlayerRace4 = row[21];
    this.teamPlayerRace5 = row[22];
    this.oldTeamRating = Number(row[23]);
    this.newTeamRating = Number(row[24]);
    this.diffRating = Number(row[25]);
    this.mmr = Number(row[26]);
    this.enemyOldTeamRating = Number(row[27]);
    this.enemyNewTeamRating = Number(row[28]);
    this.enemyDiffRating = Number(row[29]);
    this.enemyMmr = Number(row[30]);
    this.enemyTeamName = row[31];
    this.enemyPlayerName1 = row[32];
    this.enemyPlayerName2 = row[33];
    this.enemyPlayerName3 = row[34];
    this.enemyPlayerName4 = row[35];
    this.enemyPlayerName5 = row[36];
    this.enemyPlayerClass1 = row[37];
    this.enemyPlayerClass2 = row[38];
    this.enemyPlayerClass3 = row[39];
    this.enemyPlayerClass4 = row[40];
    this.enemyPlayerClass5 = row[41];
    this.enemyPlayerRace1 = row[42];
    this.enemyPlayerRace2 = row[43];
    this.enemyPlayerRace3 = row[44];
    this.enemyPlayerRace4 = row[45];
    this.enemyPlayerRace5 = row[46];
    this.enemyFaction = row[47];
  }

  getComposition = brackets => {
    // We could have added all 5 classes and then filter out falsy values, but it would not be resilient to "ghost player" bugs
    let arr = [this.enemyPlayerClass1, this.enemyPlayerClass2];
    if (brackets.includes('5s'))
      arr.push(
        this.enemyPlayerClass3,
        this.enemyPlayerClass4,
        this.enemyPlayerClass5
      );
    else if (brackets.includes('3s')) arr.push(this.enemyPlayerClass3);
    return arr
      .filter(it => !!it)
      .sort((a, b) => a.localeCompare(b))
      .join('+');
  };

  won = () =>
    (this.teamColor &&
      this.winnerColor &&
      this.teamColor === this.winnerColor) ||
    this.diffRating > 0 ||
    this.enemyDiffRating < 0;

  isTitleOrSkirmish = () =>
    this.isRanked === 'isRanked' ||
    this.enemyFaction === 'enemyFaction' ||
    this.isRanked === 'NO';

  isRowClean = () =>
    this.teamPlayerName1 &&
    this.teamPlayerName2 &&
    this.enemyPlayerClass1 &&
    this.enemyPlayerClass2 &&
    this.enemyFaction &&
    ((this.teamColor && this.winnerColor) || !isNaN(this.diffRating)) &&
    this.isValidSeason();

  is2sData = () =>
    !this.teamPlayerName3 &&
    !this.teamPlayerClass3 && // TODO: was previously name only, any reason?
    !this.teamPlayerName4 &&
    !this.teamPlayerClass4 &&
    !this.teamPlayerName5 &&
    !this.teamPlayerClass5;

  is3sData = () =>
    this.teamPlayerName3 &&
    this.teamPlayerClass3 &&
    !this.teamPlayerName4 &&
    !this.teamPlayerClass4 &&
    !this.teamPlayerName5 &&
    !this.teamPlayerClass5;

  is5sData = () =>
    this.teamPlayerName3 &&
    this.teamPlayerClass3 &&
    this.teamPlayerName4 &&
    this.teamPlayerClass4 &&
    this.teamPlayerName5 &&
    this.teamPlayerClass5;

  isSeasonOne() {
    return this.startTime > SEASON_ONE_START && this.startTime < SEASON_ONE_END;
  }

  isSeasonTwo() {
    return this.startTime > SEASON_TWO_START && this.startTime < SEASON_TWO_END;
  }

  isSeasonThree() {
    return (
      this.startTime > SEASON_THREE_START && this.startTime < SEASON_THREE_END
    );
  }

  isSeasonFour() {
    return this.startTime > SEASON_FOUR_START;
  }

  isValidSeason() {
    return (
      this.isSeasonOne() ||
      this.isSeasonTwo() ||
      this.isSeasonThree() ||
      this.isSeasonFour()
    );
  }

  matchSummary = () => {
    const outcome = this.won() ? 'Victory' : 'Defeat';
    const mmr = this.mmr ? ` at ${this.mmr} MMR` : '';
    const enemies = this.enemies();
    return `${outcome} as ${this.allies()} vs ${enemies}${mmr}`;
    // could also have shown isRanked/diffRating, day (endTime), zoneId...
  };

  allies = () =>
    [
      this.teamPlayerName1,
      this.teamPlayerName2,
      this.teamPlayerName3,
      this.teamPlayerName4,
      this.teamPlayerName5,
    ]
      .filter(a => !!a)
      .join('/');

  enemies = () => {
    const enemies = [
      enemy(this.enemyPlayerName1, this.enemyPlayerClass1),
      enemy(this.enemyPlayerName2, this.enemyPlayerClass2),
      enemy(this.enemyPlayerName3, this.enemyPlayerClass3),
      enemy(this.enemyPlayerName4, this.enemyPlayerClass4),
      enemy(this.enemyPlayerName5, this.enemyPlayerClass5),
    ];

    return enemies.filter(e => !!e).join(' and ');
  };
}

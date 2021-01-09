module.exports = {
  calculateMoney: (distance, moneyStrategy) => {
    const configMoney = moneyStrategy.step || [];
    const min = moneyStrategy.minMoney;

    let money = 0;
    for(let i=0; i<configMoney.length; i++) {
      if (configMoney[i].distance === 0) {
        money += configMoney[i].money*distance;
        break;
      } else if (distance >= configMoney[i].distance) {
        distance -= configMoney[i].distance
        money += configMoney[i].money*configMoney[i].distance
      } else {
        money += configMoney[i].money*distance;
        break;
      }
    }

    if(money < min) {
      money = min;
    }

    return Math.round(money*10)/10;
  },
  calculateBonus: (distance, bonusStrategy) => {
    let bonus = 0;
    if(Array.isArray(bonusStrategy)) {
      for(let i=0;i<bonusStrategy.length;i++) {
        let e = bonusStrategy[i];
        if((distance >= e.from) && (distance <= e.to)) {
          bonus = e.min + (distance-e.from)/(e.to-e.from)*(e.max - e.min);
          break;
        }
      }
    }

    return Math.round(bonus);
  }
}

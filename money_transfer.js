function canBeBalanced(balance){
    const diff=Object.values(balance).reduce((acc,curr)=>{
            return acc+(curr-100);
    },0)
    return diff>=0;
}

function generate_diff(balance){
    const diffmap={};
    const LIMIT=100;
    for(let key in balance){
        diffmap[key]=balance[key]-LIMIT;
    }
    return diffmap;
}

function balance_amount(balance){
    if(!canBeBalanced(balance)){
        return console.error("Cannot be balanced");
    }
    const balance_map=generate_diff(balance);
    const transactions=[];
    const LIMIT=100;

    for(let key in balance){
        if(balance[key]<LIMIT){
            for(let dkey in balance){
                if(dkey===key)continue;
                const shortage=balance_map[key];
                const difference=balance_map[dkey];
                if(difference<=0)continue;
                const amount=Math.min(difference,Math.abs(shortage));
                balance_map[key]+=amount;
                balance_map[dkey]-=amount;
                transactions.push(`from: ${dkey}, to: ${key}, amount: ${amount}`)
                if(balance_map[key]===0)break;
            }
        }
    }
    console.log(balance_map);
    return transactions;
}

const balance={
    AU:80,
    US:140,
    MX:110,
    SG:120,
    FR:70
}

console.log(balance_amount(balance));
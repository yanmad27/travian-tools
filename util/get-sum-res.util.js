function getSumRes() {
    var res = document.querySelectorAll('[class="averageRaidBounty"] [class="value"]');
    var sum = 0;
    res.forEach((cur) => {
        sum += Number(cur.innerText.replace(/\.|\,|\u202D|\u202C/g, ''));
    });
    console.log(sum);
}

getSumRes();

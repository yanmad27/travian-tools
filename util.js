function getSumRes() {
    var sum = 0;
    a.forEach((t) => {
        var number = t.innerText.replace(/\.|\u202D|\u202C/g, '');
        sum += Number(number);
    });
    console.log(sum);
}

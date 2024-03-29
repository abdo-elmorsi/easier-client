import moment from "moment";

export function formatDate(date, format, locale) {
    return locale ? moment(date).locale(locale).format(format) : moment(date).format(format);
}

const DEFAULT_DIGITS = 3;
export const formatMinus = (val, digits = DEFAULT_DIGITS) => {
    const absVal = Math.abs(val);
    const formattedVal = formatComma(absVal, digits);
    return val < 0 ? `(${formattedVal})` : formattedVal;
};

export function format(value) {
    let _value = value || 0;
    _value = _value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (_value.includes('.') && _value.split('.')[1].length === 1) {
        return _value += '0';
    } else if (!_value.includes('.')) {
        return parseFloat(value || 0).toFixed(2);
    }
    return _value;
}

export function formatComma(value, minimumFractionDigits = 2) {
    value = value ? parseFloat(value) : 0;
    return value.toLocaleString('en-US', { minimumFractionDigits: minimumFractionDigits, maximumFractionDigits: Math.max(2, minimumFractionDigits) });
}

export function formatComma3Decimal(n) {
    return formatComma(n, 3)
}


export function formatNumber(val) {
    return +parseFloat(val || 0).toFixed(2);
}

export function formatBy(value, sufix) {
    let _value = value;
    return _value ? parseFloat(_value).toFixed(sufix || 2) : '0.00';
}

export function formatBy3Decimal(n) {
    return formatBy(n, 3)
}
export function roundUpNearest10(num) {
    return Math.ceil(num / 10) * 10;
}

export function possitiveOrZero(value) {
    return value > 0 ? formatNumber(value) : 0;
}

export function sum(arr, prop) {
    return arr.reduce((accumulator, object) => {
        return accumulator + (prop ? +object[prop] : object);
    }, 0)
}

export function average(array, prop) { return array.reduce((ac, a) => a[prop] + ac, 0) / array.length };

export function groupBy(arr = [], groupByProperty, sumByProperty) {
    let helper = {};
    let result = arr.reduce(function (r, o) {
        let key = o[groupByProperty]?.value || o[groupByProperty];

        if (!helper[key]) {
            helper[key] = Object.assign({}, o); // create a copy of o
            r.push(helper[key]);
        } else {
            helper[key][sumByProperty] += o[sumByProperty];
        }

        return r;
    }, []);

    return result;
}


/**
 * Get the unqiue values from array
 * @param {*} array 
 * @param {*} key 
 * @returns 
 */
export const unique = (array, key) => {
    if (key) {
        return array.filter((e, i) => array.findIndex(a => a[key] === e[key]) === i);
    }
    return array.filter((e, i) => array.indexOf(e) === i);
}
/**
 * Get the first error msg
 * @param {*} object 
 * @param {*} key 
 * @returns 
 */
export const getFirstError = (errors = {}) => {
    const [firstErrorMessage] = Object.values(errors)?.flat() ?? [];
    return firstErrorMessage || ""
}


export const getStatusColor = (status) => {
    switch (status) {
        case ("Settled" || 1):
            return `settlement settlement-settled`;
        case "Not Settled" || 2:
            return `settlement settlement-not-settled`;
        default:
            return `settlement settlement-partially-settled`;
    }
};

export const yearsFilter = (yearNo = 10) => {
    const currentYear = moment().year();
    const lastTenYears = [];

    for (let i = 0; i < yearNo; i++) {
        const year = currentYear - i;
        lastTenYears.push({ label: year.toString(), value: year });
    }

    return lastTenYears;
}
export const monthsFilter = () => {
    const lastTwelveMonths = [];
    for (let i = 0; i < 12; i++) {
        const monthYear = moment().month(i);
        lastTwelveMonths.push({ label: monthYear.format('MMMM'), value: monthYear.format('MM') });
    }
    return lastTwelveMonths;
}

export const percentageChange = (start, end) => {
    return formatComma(((end - start) / (start || 1)) * 100);
};

export const getRandomCompanyName = () => {
    const fakeCorporateNames = [
        "hello1",
        "test123",
        "hello",
        "tttt",
        "test coor bug",
        "test 55",
        "YOU",
        "bgp",
        "pepsiii",
        "pepsi",
        "Test Coropate",
        "Mezo",
        "ABDO",
        "Corporate 12",
        "gdfg",
        "MOMO1",
        "MOMO",
        "1213",
        "butterfly",
        "test 33",
        "last test",
        "test repeat",
        "saypaa",
        "sayp",
        "sayed",
        "moaz",
        "caa51",
        "caa1",
        "caa",
        "Startup",
        "eleven test from b2b updated",
        "ten test from b2b",
        "nine test from b2b",
        "eight test from b2b",
        "seven test from b2b",
        "sex test from b2b",
        "fifth test from b2b",
        "fourth test from b2b",
        "third test from b2b",
        "second test from b2b",
        "test from B2B",
        "Corporate 11",
        "Test5",
        "Corporate 10",
        "Corporate 9",
        "Tawuniya",
        "Easier Test",
        "TAWUNIYA_test",
        "Test",
        "Corporate 8",
        "Corporate 7",
        "Corporate 6",
        "Corporate 5",
        "Test corporate 4",
        "TestCorporate 1",
        "Test corporate 3",
        "Test corporate 2",
        "Test company",
        "Nasser Test",
        "Rawan 2",
        "Nasser",
        "Rawan company",
        "one",
        "Test1",
        "cormee22",
        "Kolejne Korpo",
        "ZacneKorpo",
        "example corpo",
        "Korporacja0000",
        "JakiesKorpo",
        "XDKorp",
        "NamekCorporation",
        "SuperKorpo",
        "NewKorpo",
        "Korpo123456789",
        "NewCorporation",
        "Korpo512",
        "Korpo998",
        "Pro8lem",
        "kjdhkjhkjh",
        "Korpo123456",
        "KorporacjaXD (TEST B2B)",
        "NowaKorporacja123",
        "12345",
        "KorpoKorpo",
        "Corpo 2",
        "Corpo 1"
    ];
    const Index = Math.floor(Math.random() * fakeCorporateNames.length);
    return `${fakeCorporateNames[Index]}`;
}



// utils.js
export const isSuperAdmin = (session) => {
    if (session && session.user.role == "superAdmin") {
        return true
    } else {
        return false
    }
};



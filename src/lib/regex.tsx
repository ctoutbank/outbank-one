export const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    const match = digits.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);

    if (!match) return '';

    const [, ddd, part1, part2] = match;
    let formatted = '';
    if (ddd) formatted += `(${ddd}`;
    if (ddd.length === 2) formatted += ') ';
    if (part1) formatted += part1;
    if (part1.length === 5) formatted += '-';
    if (part2) formatted += part2;

    return formatted;
};

export const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);

    if (!match) return '';

    const [, part1, part2, part3, part4] = match;
    let formatted = '';

    if (part1) formatted += part1;
    if (part1.length === 3) formatted += '.';
    if (part2) formatted += part2;
    if (part2.length === 3) formatted += '.';
    if (part3) formatted += part3;
    if (part3.length === 3) formatted += '-';
    if (part4) formatted += part4;

    return formatted;
};

export const formatCep = (value: string | undefined) => {
    const digits = value?.replace(/\D/g, '').slice(0, 8);
    const match = digits?.match(/^(\d{0,5})(\d{0,3})$/);

    if (!match) return '';
    const [, part1, part2] = match;
    let formatted = '';
    if (part1) formatted += part1;
    if (part1.length === 5) formatted += '-';
    if (part2) formatted += part2;

    return formatted;
}

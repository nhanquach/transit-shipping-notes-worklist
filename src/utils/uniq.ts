export default function uniq(arr: Array<{ label: string; value: string }>) {
    const list: { label: string; value: string; }[] = []

    arr.forEach(item => {
        if (!list.some(i => i.value === item.value)) {
            list.push(item)
        }
    })

    return list
};
const sortByDate = (repairs) => {
    return repairs.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
}

export default sortByDate;
function PatientFilters({ gender, setGender }) {

    return (

        <select
            value={gender}
            onChange={(e)=>setGender(e.target.value)}
            className="border rounded-xl px-4 py-3"
        >

            <option value="">
                All Gender
            </option>

            <option value="Male">
                Male
            </option>

            <option value="Female">
                Female
            </option>

        </select>

    );

}

export default PatientFilters;
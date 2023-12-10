import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { useState } from "react"
import * as Database from "../../data/db"

const InsertSample = () => {
    const [id, setId] = useState(0);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [age, setAge] = useState(0);

    const clearForm = () => {
        setName("")
        setSurname("")
        setAge(0);
        setId(0);
    };

    const isFormValid = () => {
        return (
            id &&
            name && 
            surname &&
            age 
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        async function insert(){
            const db = await Database.get();
            const addData = {id, name, surname, age, _deleted: false, updatedAt: new Date().getTime()};
            db.sample.insert(addData);
            clearForm();
        }
        insert();
    }

    return (
            <form onSubmit={handleSubmit}>
                <div className="card flex flex-column md:flex-row gap-3 justify-center align-center">
                        <div className="p-inputgroup flex-1">
                            <InputNumber 
                                value={id}
                                onValueChange={e => setId(e.value)} 
                                placeholder="Age" />
                        </div>
                        <div className="p-inputgroup flex-1">
                            <span className="p-inputgroup-addon">
                                <i className="pi pi-user"></i>
                            </span>
                            <InputText
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                placeholder="Name" />
                        </div>
                        <div className="p-inputgroup flex-1">
                            <InputText 
                                value={surname}
                                onChange={e => setSurname(e.target.value)} 
                                placeholder="Surname" />
                        </div>

                        <div className="p-inputgroup flex-1">
                            <InputNumber 
                                value={age}
                                onValueChange={e => setAge(e.value)} 
                                placeholder="Age" />
                        </div>

                        <div className="p-inputgroup flex-1">
                            <Button type="submit" label="Submit" disabled={!isFormValid()} />
                        </div>
                
                </div>
            </form>
    )
}

export default InsertSample;
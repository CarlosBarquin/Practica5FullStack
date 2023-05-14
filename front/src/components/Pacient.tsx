import { getSSRClient } from "@/libs/client";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;


const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 24px;
`;

const Button = styled.button`
  background-color: #0070f3;
  color: #fff;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  margin-right: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #0061d6;
  }
`;


const BOOK_SLOT = gql`
  mutation ($year: Int!, $month: Int!, $day: Int!, $hour: Int!, $dni: String!) {
    bookSlot(year: $year, month: $month, day: $day, hour: $hour, dni: $dni) {
      day
      month
      year
      hour
      available
    }
  }
`;

const GET_AVAILABLE_SLOTS = gql`
  query ($year: Int!, $month: Int!) {
    availableSlots(year: $year, month: $month) {
      available
      day
      month
      hour
      year
      dni
    }
  }
`;

const Pagina = () => {
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);
  const [hour, setHour] = useState<number>(0);
  const [dni, setDni] = useState<string>("");

  const [yearSearchInput, setYearSearchInput] = useState<number>(0);
  const [monthSearchInput, setMonthSearchInput] = useState<number>(0);
  const [yearSearch, setYearSearch] = useState<number>(0);
  const [monthSearch, setMonthSearch] = useState<number>(0);

  const [bookSlot] = useMutation(BOOK_SLOT, {
    variables: { year, month, day, hour, dni },
    onCompleted: () => {
      alert("Slot reservado");
    },
    onError: () => {
      alert("Slot no disponible");
    }
  });

  const { loading, error, data } = useQuery<{
    availableSlots: {
      available: boolean;
      day: number;
      month: number;
      hour: number;
      year: number;
      dni: string;
    }[];
  }>(GET_AVAILABLE_SLOTS, {
    variables: {
      year: yearSearch,
      month: monthSearch,
    },
  });

  const handleSearchSlots = () => {
    setYearSearch(yearSearchInput);
    setMonthSearch(monthSearchInput);
  };

  const validateDate = () => {
    if (year == 0 || month == 0 || day == 0 || hour == 0) {
      alert("Faltan campos por rellenar");
      return false;
    }
    if (month > 12 || month < 1) {
      alert("Mes no valido");
      return false;
    }
    if (day > 31 || day < 1) {
      alert("Dia no valido");
      return false;
    }
    if (hour > 23 || hour < 0) {
      alert("Hora no valida");
      return false;
    }
  
    return true;
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;


    

  return (
        <>
        <Container>
            <Title>Medico</Title> 

                <h1>Reservar Slots</h1>
                <input type="number" placeholder="Año" onChange={(e) => setYear(parseInt(e.target.value))}></input>
                <input type="number" placeholder="Mes" onChange={(e) => setMonth(parseInt(e.target.value))}></input>
                <input type="number" placeholder="Dia" onChange={(e) => setDay(parseInt(e.target.value))}></input>
                <input type="number" placeholder="Hora" onChange={(e) => setHour(parseInt(e.target.value))}></input>
                <input type="text" placeholder="DNI" onChange={(e) => setDni(e.target.value)}></input>
                <br></br>
                <Button onClick={() => {
                    if (validateDate()) bookSlot();
                }}>Reservar slot</Button>
                <br></br>
                <h1>Buscar Slots</h1>
                <input type="number" placeholder="Año" onChange={(e) => setYearSearchInput(parseInt(e.target.value))}></input>
                <input type="number" placeholder="Mes" onChange={(e) => setMonthSearchInput(parseInt(e.target.value))}></input>
                <br></br>
                <Button onClick={() => {
                    if(monthSearchInput > 12 || monthSearchInput < 1) {
                        alert("Mes no valido");
                    }else{
                      handleSearchSlots();
                    }
                
                }}>Buscar slots</Button>
          
          <br></br>
            {yearSearch !== 0 && monthSearch !== 0 && (
              <>
                {data?.availableSlots.length ? (
                  data.availableSlots.map((slot) => (
                    <div key={slot.day}>
                      <p>{slot.day}/{slot.month}/{slot.year} {slot.hour}:00</p>
                      <p>{slot.available ? "Disponible" : "No disponible"}</p>
                      <p>{slot.dni}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay slots disponibles para esta fecha.</p>
                )}
              </>
            )}
        </Container>
        </>

    )

}

export default Pagina
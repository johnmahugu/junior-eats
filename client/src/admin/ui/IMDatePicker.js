import React from 'react';
import { Card, CardBody } from "reactstrap";
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";
 
const IMDatePicker = props => (
    <Card className="card-calendar-input">
        <CardBody>
            <DatePicker
                selected={props.selected}
                onChange={props.onChange}
                showTimeSelect
                dateFormat="Pp"
            />
        </CardBody>
    </Card>
)

export default IMDatePicker
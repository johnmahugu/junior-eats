import React, { useEffect, useState } from 'react';
import { IMColorBoxComponent } from '../../../common'
import { IMLocationTableCell, IMImagesTableCell, IMDateTableCell, IMAddressTableCell, IMColorsTableCell, IMForeignKeyTableCell } from '../../ui/IMTable';

const baseAPIURL = require("../../../admin/config").baseAPIURL

function IMOrdersProductArrayTableCell(props) {
    const { productsArray } = props
    const [isLoading, setIsLoading] = useState(true);
    const [myData, setData] = useState(null);

    useEffect(() => {
        if (productsArray) {
            setData(productsArray)
        }
        setIsLoading(false)
    }, [props.productsArray]);

    if (!productsArray || productsArray.length <= 0) {
        return null
    }

    if (isLoading) {
        return null
    }

    const viewPath = productsArray && productsArray.length && productsArray.map(elem => ("/admin/" + 'product' + "/" + elem.id + '/view'))

    return (
        <div className="ArrayTableCell productsArrayTableCell">
            {myData && myData.length > 0 &&
                myData.map( (data, index) => 
                    {
            const path = viewPath && viewPath[index]
            return (
                <li>
                    <span>
                        <a href={path}>
                            {data.name}
                        </a>
                    </span>
                </li>
            )
        }
                )
            }
        </div>
    )
}

export default IMOrdersProductArrayTableCell
import React from "react"
const Child = React.memo(({ bool, id, fn }: any) => {
    console.log("child rerendered")
    fn()
    return (
        <div>
            CHild {bool}
            {id}
        </div>


    )
}

)

export default Child
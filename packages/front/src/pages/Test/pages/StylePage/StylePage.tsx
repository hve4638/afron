import { Grid } from "@/components/layout";
import { BGColor } from "./BGColor";
import { ModalDemo } from "./ModalDemo";
import { WellModalDemo } from "./WellModalDemo";

export function StylePage() {
    return (
        <Grid
            className='wfill hfill'
            rows="repeat(2, 1fr)"
            columns="1fr 1fr"
        >
            <BGColor />
            <ModalDemo/>
            <WellModalDemo />
            <div>Box 3</div>
            <div>Box 4</div>
            {/* <div>Box 4</div>
            <div>Box 4</div> */}
        </Grid>
    )
}
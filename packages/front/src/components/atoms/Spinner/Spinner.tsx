import { SpinnerDotted } from 'spinners-react'

interface SpinnerProps {
    height?: string | number
    width?: string | number
    color?: string
}

function Spinner({
    height = '1em',
    width,
    color,
}: SpinnerProps) {
    // spinners-react uses 'size' prop instead of separate width/height
    // prefer width if provided, otherwise use height
    const size = width ?? height

    return (
        <SpinnerDotted
            size={size}
            color={color}
            style={{ display: 'inline-block' }}
        />
    )
}

export default Spinner

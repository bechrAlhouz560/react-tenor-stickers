export function TextLoading (props)
{
    const {width,height,styles} = props;
    return <div className="text-loading" style={
        {
            width,
            height,
            ...styles
        }
    }>
        
        
    </div>
}
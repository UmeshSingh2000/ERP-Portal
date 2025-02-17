const toastHelper = (toast,desc, title, duration = 1000, type = "default") => {
    return toast({
        title: title,
        variant: type,
        description: desc,
        duration: duration,
    })
}

export default toastHelper
import { Card, CardContent } from "./ui/card"

const fallbackSingle = () => {
    return (
        <div>
            <Card>

            <CardContent className="flex gap-4 sm:flex-row flex-col animate-pulse">
                <img
                    src=''
                    className="h-80 rounded-lg shadow w-6/12 mx-auto"

                />
                <div className="">
                    <div>
                        <p className="font-medium bg-gray-200 w-full h-8"></p>
                        <p className="font-medium bg-gray-200 w-full h-28"></p>
                    </div>

                        <div>
                            <p className="font-medium">Sound:</p>
                            <p className="font-medium bg-gray-200 w-full h-8"></p>
                        </div>

                    <div className="flex justify-between mt-4">
                            <div>
                                <p className="font-medium">Duration:</p>
                                <p className="font-medium bg-gray-200 w-full h-8">

                                </p>
                            </div>


                            <div>
                                <p className="font-medium">File Size:</p>
                                <p className="font-medium bg-gray-200 w-full h-8">
                                </p>
                            </div>

                    </div>

                </div>

            </CardContent>
            </Card>
        </div>
    )
}

export default fallbackSingle


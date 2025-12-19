import PropertyAddForm from "@/components/PropertyAddForm";


const AddPropertyPage = () => {
    return (
        <section className="bg-blue-50 dark:bg-gray-900 min-h-screen">
            <div className="container m-auto max-w-2xl py-24">
                <div className="bg-white dark:bg-gray-800 px-6 py-8 mb-4 shadow-md rounded-md border border-gray-200 dark:border-gray-700 m-4 md:m-0">
                    <PropertyAddForm />
                </div>
            </div>
        </section>);
}

export default AddPropertyPage;

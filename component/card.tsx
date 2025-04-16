import React from "react";

export default function Card({ title, description, imageUrl }) {
    return (
        <div className="w-72 h-72 border rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center bg-white">
            {imageUrl && <img src={imageUrl} alt={title} className="w-24 h-24 object-cover mb-2" />}
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 text-center">{description}</p>
        </div>
    );
}
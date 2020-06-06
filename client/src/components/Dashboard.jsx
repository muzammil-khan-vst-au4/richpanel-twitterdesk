import React from 'react'

export const Dashboard = ({user}) => {
    return (
        <div>
        <h1>You have login succcessfully!</h1>
        <h2>Welcome {user.name}!</h2>
      </div>
    )
}

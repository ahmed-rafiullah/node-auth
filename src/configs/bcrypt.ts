const { 

    SALT_ROUNDS = 12
} = process.env


export  const bcryptOptions = {
    SALT_ROUNDS: +SALT_ROUNDS
} 
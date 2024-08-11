"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);

    // Return the newly created user, serialized
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);  // Handle error appropriately
    throw error;         // Rethrow to ensure errors are not swallowed
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    // Return the found user, serialized
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,  // Return the updated document
    });

    if (!updatedUser) throw new Error("User update failed");

    // Return the updated user, serialized
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find the user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) throw new Error("User not found");

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    // Revalidate the path if necessary
    revalidatePath("/");

    // Return the deleted user, serialized, or null if not deleted
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// UPDATE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectToDatabase();

    // Update the user's credit balance
    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },  // Increment credit balance
      { new: true }  // Return the updated document
    );

    if (!updatedUserCredits) throw new Error("User credits update failed");

    // Return the updated user, serialized
    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
    throw error;
  }
}

/**
 * A mock service to simulate interactions with a FreeSwitch instance.
 * In a real-world application, this service would use a library like `modesl`
 * to connect to FreeSwitch's Event Socket Layer (ESL) and issue commands.
 * This mock allows the frontend and API server to function for development purposes.
 */
export class FreeSwitchService {

  constructor() {
    console.log("Mock FreeSwitch Service initialized. Call origination will be simulated.");
  }

  /**
   * Simulates originating an outbound call to a specified phone number.
   * 
   * In a real implementation, this method would construct and send an `originate`
   * command to the FreeSwitch ESL, specifying the gateway, caller ID, destination,
   * and the dialplan entry point (e.g., an echo test, a conference bridge, or a voice agent).
   * 
   * @param targetPhoneNumber The destination phone number to call.
   * @returns A promise that resolves with the outcome of the call origination attempt.
   */
  async originateCall(targetPhoneNumber: string): Promise<{ success: boolean; callId?: string; error?: string }> {
    console.log(`[MockFS] Attempting to originate call to ${targetPhoneNumber}...`);

    // Simulate network delay and processing time for realism.
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate a potential failure scenario for testing purposes.
    if (targetPhoneNumber.includes('555-FAIL')) {
        console.error(`[MockFS] Failed to originate call to ${targetPhoneNumber}. This is a simulated failure.`);
        return {
            success: false,
            error: 'Invalid or blacklisted number (mock error)',
        };
    }

    // Simulate a successful call origination.
    const mockCallId = `fs-call-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[MockFS] Successfully originated call to ${targetPhoneNumber}. Call ID: ${mockCallId}`);

    // Example of a real ESL command:
    // `bgapi originate {origination_caller_id_number=+12025550104}sofia/gateway/your_provider/${targetPhoneNumber} &echo()`
    
    return {
      success: true,
      callId: mockCallId,
    };
  }
}

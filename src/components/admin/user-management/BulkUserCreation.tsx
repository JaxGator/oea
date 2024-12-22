import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export function BulkUserCreation() {
  const { toast } = useToast();

  useEffect(() => {
    const processUserList = async () => {
      const userList: UserData[] = [
        { firstName: "Jitesh", lastName: "Doshi", email: "jitesh@spinspire.com" },
        { firstName: "Dennis", lastName: "McCarthy", email: "dennismichaelmccarthy@gmail.com" },
        { firstName: "Audra", lastName: "Yang", email: "yangminjiang38@gmail.com" },
        { firstName: "Maranda", lastName: "Pedano", email: "mpedano@hotmail.com" },
        { firstName: "Thomas", lastName: "Toupin", email: "toupintp@yahoo.com" },
        { firstName: "Pam", lastName: "Newman", email: "pzitello@gmail.com" },
        { firstName: "Jay", lastName: "Friend", email: "trezuretrader@yahoo.com" },
        { firstName: "Philip", lastName: "Wilson", email: "pawseevices2457@gmail.com" },
        { firstName: "Jina", lastName: "Salhi", email: "jinasalhi711@gmail.com" },
        { firstName: "Holly", lastName: "Peters", email: "reoactionhomes@gmail.com" },
        { firstName: "Jacksonville", lastName: "Joseph", email: "jacksonvillejoe@ymail.com" },
        { firstName: "Fran", lastName: "Thompson", email: "frant1018@gmail.com" },
        { firstName: "John", lastName: "Rhodes", email: "jrnjax@gmail.com" },
        { firstName: "Julie", lastName: "Hayes", email: "juliea40@hotmail.com" },
        { firstName: "Cassaundra", lastName: "Rosengren", email: "cassaundrarosengren6@gmail.com" },
        { firstName: "Jitesh", lastName: "Doshi", email: "jitesh@doshiland.com" },
        { firstName: "Randy", lastName: "Olson", email: "olsonhillman@yahoo.com" },
        { firstName: "Barbara", lastName: "C", email: "test@test.com" },
        { firstName: "Ken", lastName: "McLean", email: "kmclean4379@gmail.com" },
        { firstName: "Philip", lastName: "Wilson", email: "pswservices2457@gmail.com" },
        { firstName: "Scott", lastName: "Sheplak", email: "ssheplaks@gmail.com" },
        { firstName: "Katrinka", lastName: "Spiro", email: "gka2000@hotmail.com" },
        { firstName: "Maranda", lastName: "Pedano", email: "topazearings135@gmail.com" },
        { firstName: "Steve", lastName: "Reinel", email: "sjr.soos@gmail.com" },
        { firstName: "Lisa", lastName: "Warrington", email: "lisa@lisa.com" },
        { firstName: "Leslie", lastName: "Payne", email: "lapayne2008@yahoo.com" },
        { firstName: "Jina", lastName: "Salhi", email: "jinasalhi711@hotmail.com" },
        { firstName: "Wayne", lastName: "Studard", email: "drivebysurfer@hotmail.com" },
        { firstName: "Dave", lastName: "Ingram", email: "dcsai@aol.com" },
        { firstName: "Simona", lastName: "Folisi", email: "simona.folisi@gmail.com" },
        { firstName: "Deana", lastName: "Snyder", email: "dc3vi1@gmail.com" },
        { firstName: "Joseph", lastName: "Nairon", email: "jnairon@hotmail.com" },
        { firstName: "Mary", lastName: "Madden", email: "maryjmadden1@gmail.com" },
        { firstName: "Anna", lastName: "Blacnio", email: "aneta.blachnio@yahoo.com" },
        { firstName: "Katrinka", lastName: "Spiro", email: "gka2000@icloud.com" },
        { firstName: "Joseph", lastName: "Nairon", email: "rosser@email.com" },
        { firstName: "Barbara", lastName: "Cockrell", email: "bj_cockrell@yahoo.com" },
        { firstName: "Chris", lastName: "Martin", email: "pemihiker@gmail.com" },
        { firstName: "Vicki", lastName: "L", email: "hapygirl31@yahoo.com" },
        { firstName: "Joseph", lastName: "Jams", email: "harmonybeyondmusic@gmail.com" },
        { firstName: "Thomas", lastName: "Brady", email: "thomasbrady2001@aol.com" },
        { firstName: "Astrid", lastName: "Rodriguez", email: "astrid.pedrosa@gmail.com" },
        { firstName: "Danielle", lastName: "Berke", email: "daniberke@yahoo.com" },
        { firstName: "John", lastName: "Rhoads", email: "jdhn6ncbqr@privaterelay.appleid.com" },
        { firstName: "Julie", lastName: "Hayes", email: "jhayes@lifestyles4seniors.com" },
        { firstName: "Randy", lastName: "Olson", email: "silverstarfas@gmail.com" },
        { firstName: "Holly", lastName: "Peters", email: "hollyhudhomes@gmail.com" },
        { firstName: "Karl", lastName: "Schmidt", email: "kjsnj@hotmail.com" },
        { firstName: "Mike", lastName: "Hurley", email: "outdoorworks.hurley@gmail.com" },
        { firstName: "Carine Hager", lastName: "Dkhili", email: "carinek532@gmail.com" },
        { firstName: "Julie", lastName: "Morgan", email: "jjmyomama@yahoo.com" },
        { firstName: "Katrinka", lastName: "Spiro", email: "spirokatrinka@gmail.com" },
        { firstName: "Sharon", lastName: "Rodriguez", email: "sharonscallyrodriguez@gmail.com" },
        { firstName: "Julie", lastName: "Bitner", email: "julierb8561@gmail.com" },
        { firstName: "Julie", lastName: "Hayes", email: "juliehayes4422@gmail.com" },
        { firstName: "Dale", lastName: "Butler", email: "zbutler@aol.com" },
        { firstName: "Jason", lastName: "Ponder", email: "jason.ponder1@yahoo.com" },
        { firstName: "Philip", lastName: "Wilson", email: "pswservices2456@gmail.com" },
        { firstName: "Lisa", lastName: "WARRINGTON", email: "lwarrin1964@yahoo.com" },
        { firstName: "Kathy", lastName: "Shay", email: "kathyshayrealtor@gmail.com" },
        { firstName: "John", lastName: "Sztolyar", email: "jsztolyar2@gmail.com" },
        { firstName: "Jocelyn", lastName: "Biondo", email: "jocelynbiondo@gmail.com" },
        { firstName: "sheila", lastName: "santiago", email: "myanagail@gmail.com" },
        { firstName: "David", lastName: "Ingram", email: "ingramdavid512@gmail.com" }
      ];

      try {
        const { data, error } = await supabase.functions.invoke('bulk-create-users', {
          body: { users: userList }
        });

        if (error) throw error;

        const successCount = data.results.length;
        const errorCount = data.errors.length;

        toast({
          title: "Bulk User Creation Complete",
          description: `Successfully created ${successCount} users. ${errorCount} errors occurred.`,
          variant: errorCount > 0 ? "destructive" : "default"
        });

        // Log detailed results for admin reference
        console.log('Bulk creation results:', data);

      } catch (error) {
        console.error('Error in bulk user creation:', error);
        toast({
          title: "Error",
          description: "Failed to create users. Check console for details.",
          variant: "destructive"
        });
      }
    };

    // Run the import immediately when component mounts
    processUserList();
  }, []); // Empty dependency array means this runs once on mount

  return null; // No UI needed
}